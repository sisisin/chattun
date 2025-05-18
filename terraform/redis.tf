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
