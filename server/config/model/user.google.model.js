
import mongoose from "mongoose";

const usergoogleSchema = new mongoose.Schema({
	googleId: {
		type: String,
		// unique: true,
		sparse: true,
		required: false
	},
	name: {
		type: String,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	phoneNo: {
		type: String,
		unique: true,
		sparse: true
	},
	password: {
		type: String,
		required: function() {
			return !this.googleId;
		}
	}
});

const UserGoogle = mongoose.model('UserGoogle', usergoogleSchema);
export default UserGoogle;
