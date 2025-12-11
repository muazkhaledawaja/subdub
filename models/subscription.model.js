import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minlength: [3, "Subscription name must be at least 3 characters long"],
        maxlength: [100, "Subscription name must be at most 100 characters long"]
    },
    price: {
        type: Number,
        required: [true, "Subscription price is required"],
        min: [0, "Subscription price must be at least 0"]
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "INR", "JPY", "CNY"],
        default: "USD"
    },
    frequency: {
        type: String,
        enum: ["monthly", "yearly", "weekly", "daily"],
        required: [true, "Subscription frequency is required"]
    },
    category: {
        type: String,
        enum: ["entertainment", "productivity", "education", "health", "other"],
        default: "other",
        required: [true, "Subscription category is required"]
    },

    paymentMethod: {
        type: String,
        enum: ["credit_card", "debit_card", "paypal", "bank_transfer", "other"],
        default: "other",
        required: [true, "Payment method is required"]
    },
    status: {
        type: String,
        enum: ["active", "expired", "canceled", "paused"],
        default: "active",
        required: [true, "Subscription status is required"]
    },
    startDate: {
        type: Date,
        required: [true, "Subscription start date is required"],
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: "Start date cannot be in the future"
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: "Renewal date must be after start date"
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Associated user is required"],
        index: true
    }

}, { timestamps: true });

// Auto calculate renewalDate if missing
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const start = new Date(this.startDate || new Date());

        switch (this.frequency) {
            case 'daily':
                start.setDate(start.getDate() + 1);
                break;
            case 'weekly':
                start.setDate(start.getDate() + 7);
                break;
            case 'monthly':
                start.setMonth(start.getMonth() + 1);
                break;
            case 'yearly':
                start.setFullYear(start.getFullYear() + 1);
                break;
        }

        this.renewalDate = start;
    }

    // Only auto-expire active subscriptions
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const renewalDay = new Date(this.renewalDate);
    renewalDay.setHours(0, 0, 0, 0);

    if (this.status === 'active' && renewalDay < today) {
        this.status = 'expired';
    }

    next();
});

export  const Subscription = mongoose.model("Subscription", subscriptionSchema); 