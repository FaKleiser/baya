export enum MetadataLocation {
    /** metadata location is meta.yml */
    META,
    /** metadata location is <ENTRY_SLUG>.yml */
    SLUG,
    /** both metadata locations are considered in the following order: SLUG, META */
    ALL,
}
