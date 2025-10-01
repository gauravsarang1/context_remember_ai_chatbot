import { Schema, model} from "mongoose";

const summarySchema = new Schema({
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Summary = model('Summary', summarySchema);

export default Summary;