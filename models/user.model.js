const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true, index: true }, // Add index for query performance faster
    password: { type: String, required: true, minLength: 6 },
}, {
    timestamps: true
});

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}
const User = mongoose.model("User", userSchema);

module.exports = User;