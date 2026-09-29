/** "Browser & Device" -> "browser-device" */
export function categorySlug(category: string) {
    return category.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
