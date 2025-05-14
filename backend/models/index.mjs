import Locality from "./locality.mjs";
import Listing from "./listing.mjs";
import User from "./user.mjs";
import Agency from "./agency.mjs";
import SavedProperty from "./saved_property.mjs";
import Image from "./image.mjs";

Agency.hasMany(User)
User.belongsTo(Agency)

User.hasMany(Listing)
Listing.belongsTo(User)

Locality.hasMany(Listing)
Listing.belongsTo(Locality)

User.hasMany(SavedProperty, { foreignKey: 'UserId' });
SavedProperty.belongsTo(User, { foreignKey: 'UserId' });
Listing.hasMany(SavedProperty, { foreignKey: 'ListingId' });
SavedProperty.belongsTo(Listing, { foreignKey: 'ListingId' });

Listing.hasMany(Image)
Image.belongsTo(Listing)

export default {
    Locality,
    Agency,
    User,
    Listing,
    SavedProperty,
    Image
}