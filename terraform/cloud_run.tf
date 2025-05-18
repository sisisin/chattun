resource "google_cloud_run_v2_service" "chattun_server" {
  name                = "chattun-server"
  project             = var.project_id
  location            = var.region
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
        name = "SERVER_BASE_URL"
        # NOTE: 初回deployではservice作成後に直す必要がある
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
    ]
  }
}

resource "google_cloud_run_v2_service_iam_binding" "chattun_server_public_access" {
  location = var.region
  project  = var.project_id
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

  project   = var.project_id
  secret_id = each.value
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_iam_member" "chattun_server" {
  for_each = local.secret_ids

  project   = var.project_id
  secret_id = google_secret_manager_secret.chattun_server[each.key].id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.chattun_server.email}"
}

resource "google_project_iam_member" "chattun_server_log_creator" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.chattun_server.email}"
}

resource "google_cloud_run_v2_service_iam_member" "chattun_deploy_permission" {
  project  = var.project_id
  location = var.region
  name     = "chattun-server"
  role     = "roles/run.developer"
  member   = "serviceAccount:${google_service_account.run_deployer.email}"
}
