export interface Product {
    _id: string;
    ProductId: string | number;
    ProductName: string;
    Design: number;
    SKU: string;
    Color: string;
    Price: number;
    Rating: number;
    Fabric: string;
    ProductDescription: string;
    NeckType: string;
    Occassion: string;
    BrandName: string;
    StitchType: string;
    Size: string;
    Image1: string;
    Image2: string;
    SizeChart: string;
    Platform?: string;
    Link?: string;
    topSelling: Boolean;
    topRated: Boolean;
}
