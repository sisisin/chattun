
resource "google_service_account" "chattun_server" {
  project      = local.project_id
  account_id   = "chattun-server"
  display_name = "Service Account for Chattun Server"
}

resource "google_service_account" "run_deployer" {
  account_id   = "run-deployer-chattun"
  display_name = "Chattun Cloud Run Deployer Service Account"
  project      = local.project_id
  description  = "Service account for deploying chattun to Cloud Run from GitHub Actions"
}

resource "google_service_account_iam_binding" "github_sa_binding" {
  service_account_id = google_service_account.run_deployer.name
  role               = "roles/iam.workloadIdentityUser"
  members = [
    "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.chattun_pool.name}/attribute.repository/sisisin/chattun"
  ]
}

resource "google_service_account_iam_member" "act_as_chattun_server" {
  service_account_id = google_service_account.chattun_server.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.run_deployer.email}"
}
