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
  project = var.project_id
  region  = var.region
}
