use tauri::menu::{AboutMetadataBuilder, MenuBuilder, SubmenuBuilder};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let version = app.package_info().version.to_string();
            let icon = Some(tauri::include_image!("icons/128x128@2x.png"));
            let about = AboutMetadataBuilder::new()
                .name(Some("Fig".to_string()))
                .version(Some(version))
                .copyright(Some("Copyright © 2026 — Fig Contributors".to_string()))
                .icon(icon)
                .build();

            let app_submenu = SubmenuBuilder::new(app, "Fig")
                .about(Some(about))
                .separator()
                .hide()
                .hide_others()
                .show_all()
                .separator()
                .quit()
                .build()?;

            let menu = MenuBuilder::new(app).item(&app_submenu).build()?;
            app.set_menu(menu)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Fig");
}
