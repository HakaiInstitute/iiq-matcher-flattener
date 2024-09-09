// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::time::Duration;
use ix_match::process_images;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn run(rgb_dir: &str, nir_dir: &str, thresh: u64) -> Result<String, String> {
    println!("Running with {} {} {}", rgb_dir, nir_dir, thresh);

    let thresh = Duration::from_millis(thresh);
    let rgb_dir = std::path::Path::new(rgb_dir);
    let nir_dir = std::path::Path::new(nir_dir);

    match process_images(rgb_dir, nir_dir, thresh, false, true) {
        Ok((rgb_count, nir_count, matched_count)) => {
            Ok(format!("RGB: {}, NIR: {} ({} match)", rgb_count, nir_count, matched_count))
        },
        Err(e) => Err(e.to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
