class ProductFilterDTO {
    constructor(product_name, min_price, max_price, is_new, brand, product_location, specifications, count) 
    {
        this.product_name = product_name;
        this.min_price = min_price;
        this.max_price = max_price;
        this.is_new = is_new;
        this.brand = brand;
        this.product_location = product_location;
        this.specifications = specifications;
        this.count = count == undefined ? 30 : count;
    }
}

module.exports = ProductFilterDTO;