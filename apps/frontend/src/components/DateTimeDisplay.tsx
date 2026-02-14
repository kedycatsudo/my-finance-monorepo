"use client";
import { useEffect, useState } from "react";

export default function DateTimeDisplay() {
	const [now, setNow] = useState<Date | null>(null);

	useEffect(() => {
		setNow(new Date()); // Set initial value on client only
		const interval = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	if (!now) return null; // Or a placeholder if you prefer

	return (
		<span>
			{now.toLocaleDateString()} {now.toLocaleTimeString()}
		</span>
	);
}
