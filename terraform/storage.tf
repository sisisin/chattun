data "google_storage_bucket" "chattun_tfstate" {
  name = "knowledgework-simenyan-sandbox-chattun-tfstate"
}

resource "google_storage_bucket_iam_member" "read_chattun_tfstate" {
  bucket = data.google_storage_bucket.chattun_tfstate.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${google_service_account.run_deployer.email}"
}
