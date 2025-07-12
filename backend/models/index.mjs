import Locality from "./locality.mjs";
import Listing from "./listing.mjs";
import User from "./user.mjs";
import Agency from "./agency.mjs";
import SavedProperty from "./saved_property.mjs";
import Image from "./image.mjs";

Agency.hasMany(User)
User.belongsTo(Agency)

User.hasMany(Listing, {
    onDelete: 'CASCADE',
    hooks: true
})
Listing.belongsTo(User)

Locality.hasMany(Listing)
Listing.belongsTo(Locality)

User.hasMany(SavedProperty, { foreignKey: 'UserId', onDelete: 'CASCADE', hooks: true });
SavedProperty.belongsTo(User, { foreignKey: 'UserId' });
Listing.hasMany(SavedProperty, { foreignKey: 'ListingId', onDelete: 'CASCADE', hooks: true });
SavedProperty.belongsTo(Listing, { foreignKey: 'ListingId' });

Listing.hasMany(Image, {
    onDelete: 'CASCADE',
    hooks: true
})
Image.belongsTo(Listing)

export default {
    Locality,
    Agency,
    User,
    Listing,
    SavedProperty,
    Image
}