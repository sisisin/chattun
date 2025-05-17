locals {
  project_id = "knowledgework-simenyan-sandbox"
  region     = "asia-northeast1"
}

# Terraformの設定
terraform {
  backend "gcs" {
    bucket = "knowledgework-simenyan-sandbox-chattun-tfstate"
    prefix = "chattun-tfstate"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.28.0"
    }
  }
}

provider "google" {
  project = local.project_id
  region  = local.region
}

resource "google_artifact_registry_repository" "chattun_app" {
  project       = local.project_id
  location      = local.region
  repository_id = "chattun-app"
  description   = "Docker repository for chattun"
  format        = "DOCKER"
}


resource "google_redis_instance" "chattun_redis" {
  name               = "chattun-redis"
  tier               = "BASIC"
  memory_size_gb     = 1
  region             = local.region
  project            = local.project_id
  redis_version      = "REDIS_6_X"
  display_name       = "chattun redis"
  authorized_network = "default"
  maintenance_policy {
    weekly_maintenance_window {
      day = "SATURDAY"
      start_time {
        hours   = 19
        minutes = 0
        seconds = 0
        nanos   = 0
      }
    }
  }
}

resource "google_service_account" "chattun_server" {
  project      = local.project_id
  account_id   = "chattun-server"
  display_name = "Service Account for Chattun Server"
}


resource "google_cloud_run_v2_service" "chattun_server" {
  name                = "chattun-server"
  project             = local.project_id
  location            = local.region
  deletion_protection = false

  template {
    vpc_access {
      network_interfaces {
        network    = "default"
        subnetwork = "default"
      }
    }
    containers {
      # NOTE: deploy時に埋める
      image = "sisisin/chattun-server:20250509-082835"

      env {
        name  = "SERVER_BASE_URL"
        value = "https://chattun-server-abfreslzha-an.a.run.app"
      }

      env {
        name  = "REDIS_URL"
        value = "redis://${google_redis_instance.chattun_redis.host}:${google_redis_instance.chattun_redis.port}"
      }

      env {
        name = "SLACK_APP_TOKEN"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.chattun_server["CHATTUN_SLACK_APP_TOKEN"].id
            version = "latest"
          }
        }
      }
      env {
        name = "CLIENT_ID"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.chattun_server["CHATTUN_CLIENT_ID"].id
            version = "latest"
          }
        }
      }
      env {
        name = "CLIENT_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.chattun_server["CHATTUN_CLIENT_SECRET"].id
            version = "latest"
          }
        }
      }
    }
    service_account = google_service_account.chattun_server.email
  }

  lifecycle {
    ignore_changes = [
      client,
      client_version,
      template[0].containers[0].image,
      # template[0].containers[0].env
    ]
  }
}

resource "google_cloud_run_v2_service_iam_binding" "chattun_server_public_access" {
  location = local.region
  project  = local.project_id
  name     = google_cloud_run_v2_service.chattun_server.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]
}


locals {
  secret_ids = toset([
    "CHATTUN_SLACK_APP_TOKEN",
    "CHATTUN_CLIENT_ID",
    "CHATTUN_CLIENT_SECRET",
  ])
}
resource "google_secret_manager_secret" "chattun_server" {
  for_each = local.secret_ids

  project   = local.project_id
  secret_id = each.value
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_iam_member" "chattun_server" {
  for_each = local.secret_ids

  project   = local.project_id
  secret_id = google_secret_manager_secret.chattun_server[each.key].id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.chattun_server.email}"
}

resource "google_project_iam_member" "chattun_server_log_creator" {
  project = local.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.chattun_server.email}"
}

output "chattun_server_url" {
  value = google_cloud_run_v2_service.chattun_server.uri
}
output "region" {
  value = local.region
}
output "project_id" {
  value = local.project_id
}
output "chattun_server_service_account" {
  value = google_service_account.chattun_server.email
}
output "chattun_server_name" {
  value = google_cloud_run_v2_service.chattun_server.name
}
output "registry_name" {
  value = google_artifact_registry_repository.chattun_app.name
}
