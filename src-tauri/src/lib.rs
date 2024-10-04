// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use ix_match::process_images;
use std::time::Duration;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn process(rgb_dir: &str, nir_dir: &str, thresh: u64) -> Result<String, String> {
    println!("Running with {} {} {}", rgb_dir, nir_dir, thresh);

    let thresh = Duration::from_millis(thresh);
    let rgb_dir = std::path::Path::new(rgb_dir);
    let nir_dir = std::path::Path::new(nir_dir);

    match process_images(rgb_dir, nir_dir, thresh, false, false, true) {
        Ok((rgb_count, nir_count, matched_count, empty_rgb_count, empty_nir_count)) => Ok(
            format!("RGB: {rgb}, NIR: {nir} ({match} match)\nEmpty RGB: {rgb_e}, Empty NIR: {nir_e}",
                       rgb = rgb_count, nir = nir_count,
                       match = matched_count,
                       rgb_e = empty_rgb_count, nir_e = empty_nir_count),
        ),
        Err(e) => Err(e.to_string()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![process])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
