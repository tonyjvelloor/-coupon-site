"use client";

import { useState, useEffect } from "react";
import { X, ShoppingCart, Clock } from "lucide-react";

interface Notification {
    id: number;
    name: string;
    store: string;
    savings: string;
    time: string;
}

const REGIONAL_DATA = {
    IN: {
        names: ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Rohit"],
        cities: ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad", "Kolkata"],
        stores: ["Amazon", "Flipkart", "Myntra", "Swiggy", "Zomato", "Ajio", "Tata Cliq"],
        currency: "₹",
        savingsRange: [100, 2500]
    },
    US: {
        names: ["James", "Sarah", "Michael", "Emily", "David", "Jessica", "Daniel"],
        cities: ["New York", "Los Angeles", "Chicago", "Houston", "Miami", "Seattle", "Austin"],
        stores: ["Amazon", "Walmart", "Target", "Best Buy", "Ebay", "Macy's", "Costco"],
        currency: "$",
        savingsRange: [5, 50]
    },
    UK: {
        names: ["Oliver", "Charlotte", "Harry", "Amelia", "Jack", "Isabella", "Thomas"],
        cities: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Bristol"],
        stores: ["Amazon", "Tesco", "Sainsbury's", "Argos", "ASOS", "Currys", "John Lewis"],
        currency: "£",
        savingsRange: [5, 40]
    },
    EU: {
        names: ["Lucas", "Emma", "Louis", "Mia", "Gabriel", "Sofia", "Matteo"],
        cities: ["Paris", "Berlin", "Madrid", "Rome", "Amsterdam", "Brussels", "Vienna"],
        stores: ["Amazon", "Zalando", "MediaMarkt", "Carrefour", "Lidl", "IKEA", "H&M"],
        currency: "€",
        savingsRange: [5, 45]
    },
    GLOBAL: {
        names: ["Alex", "Maria", "John", "Anna", "Chris", "Lisa", "Mark"],
        cities: ["New York", "London", "Sydney", "Toronto", "Singapore", "Berlin", "Tokyo"],
        stores: ["Amazon", "AliExpress", "Ebay", "Walmart", "Best Buy", "Target", "Sephora"],
        currency: "$",
        savingsRange: [5, 50]
    }
};

type RegionKey = keyof typeof REGIONAL_DATA;

function getRegionFromTimezone(): RegionKey {
    try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timeZone.startsWith("Asia/Kolkata") || timeZone.startsWith("Asia/Calcutta")) return "IN";
        if (timeZone.startsWith("America/")) return "US";
        if (timeZone.startsWith("Europe/London")) return "UK";
        if (timeZone.startsWith("Europe/")) return "EU";
        return "GLOBAL";
    } catch (e) {
        return "IN"; // Default fallback if detection fails
    }
}

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateNotification(region: RegionKey, id: number): Notification {
    const data = REGIONAL_DATA[region];
    const name = getRandomItem(data.names);
    const city = getRandomItem(data.cities);
    const store = getRandomItem(data.stores);
    const savingsAmount = Math.floor(Math.random() * (data.savingsRange[1] - data.savingsRange[0]) + data.savingsRange[0]);
    const timeAgo = Math.floor(Math.random() * 59) + 1; // 1-59 mins ago

    return {
        id,
        name: `${name} from ${city}`,
        store,
        savings: `${data.currency}${savingsAmount}`,
        time: `${timeAgo} mins ago`
    };
}

export default function SocialProofPopup() {
    const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [region, setRegion] = useState<RegionKey>("IN");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const userRegion = getRegionFromTimezone();
        setRegion(userRegion);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const showNotification = () => {
            const newNotification = generateNotification(region, Date.now());
            setCurrentNotification(newNotification);
            setIsVisible(true);

            // Hide after 4 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 4000);
        };

        // Show first notification after 3 seconds
        const initialDelay = setTimeout(showNotification, 3000);

        // Then show every 12 seconds (less frequent to be less annoying)
        const interval = setInterval(showNotification, 12000);

        return () => {
            clearTimeout(initialDelay);
            clearInterval(interval);
        };
    }, [region, mounted]);

    if (!mounted || !isVisible || !currentNotification) return null;

    return (
        <div className="social-proof dark:bg-gray-800 dark:text-white dark:border dark:border-gray-700">
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                    {currentNotification.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                    Saved <span className="font-bold text-green-600 dark:text-green-400">{currentNotification.savings}</span> on {currentNotification.store}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <Clock className="w-3 h-3" />
                    {currentNotification.time}
                </div>
            </div>
        </div>
    );
}
