const mongoose = require('mongoose');
const { generateUniqueCode } = require('../../utils/util');

const ticketSchema = new mongoose.Schema({
	code: {
		type: String,
		unique: true,
		required: true,
		default: () => generateUniqueCode()
	},
	purchase_datetime: {
		type: Date,
		default: Date.now,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	purchaser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

const TicketModel = mongoose.model('Ticket', ticketSchema);

module.exports = TicketModel;