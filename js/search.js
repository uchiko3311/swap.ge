export function filterItems(items, category, minPrice) {
    return items.filter(item => 
        (category === "all" || item.category === category) &&
        (item.price >= minPrice)
    );
}
