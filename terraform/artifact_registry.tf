resource "google_artifact_registry_repository" "chattun_app" {
  project       = var.project_id
  location      = var.region
  repository_id = "chattun-app"
  description   = "Docker repository for chattun"
  format        = "DOCKER"
}

resource "google_artifact_registry_repository_iam_member" "deploy" {
  project    = var.project_id
  location   = var.region
  repository = google_artifact_registry_repository.chattun_app.id
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${google_service_account.run_deployer.email}"
}
