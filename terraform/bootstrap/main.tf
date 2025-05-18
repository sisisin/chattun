terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.28.0"
    }
  }
}

locals {
  project_id  = "knowledgework-simenyan-sandbox"
  region      = "asia-northeast1"
  bucket_name = "${var.project_id}-chattun-tfstate"
}

resource "google_storage_bucket" "terraform_state" {
  name     = local.bucket_name
  location = var.region
  project  = var.project_id

  versioning {
    enabled = true
  }

  storage_class               = "STANDARD"
  uniform_bucket_level_access = true

  lifecycle_rule {
    action {
      type = "Delete"
    }

    condition {
      num_newer_versions = 3
    }
  }
}

