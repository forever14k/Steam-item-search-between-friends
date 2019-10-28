export interface SisTag {
    kind: string;         // unique for parser
    categoryName: string; // unique between all tags
    name: any;            // unique between current category tags
}
