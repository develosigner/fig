use tauri::menu::{AboutMetadataBuilder, MenuBuilder, MenuItemBuilder, SubmenuBuilder};
use tauri::Emitter;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let version = app.package_info().version.to_string();
            let icon = Some(tauri::include_image!("icons/128x128@2x.png"));
            let about = AboutMetadataBuilder::new()
                .name(Some("Fig".to_string()))
                .version(Some(version))
                .copyright(Some("Copyright © 2026 — Fig Contributors".to_string()))
                .icon(icon)
                .build();

            let check_updates = MenuItemBuilder::new("Check for Updates…")
                .id("check_updates")
                .build(app)?;

            let app_submenu = SubmenuBuilder::new(app, "Fig")
                .about(Some(about))
                .item(&check_updates)
                .separator()
                .hide()
                .hide_others()
                .show_all()
                .separator()
                .quit()
                .build()?;

            let menu = MenuBuilder::new(app).item(&app_submenu).build()?;
            app.set_menu(menu)?;

            app.on_menu_event(|app, event| {
                if event.id() == "check_updates" {
                    let _ = app.emit("menu-check-for-updates", ());
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Fig");
}
