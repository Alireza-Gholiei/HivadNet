self.addEventListener("install", function () {
	self.skipWaiting();
});

self.addEventListener("activate", function (event) {
	event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", function (event) {
	event.notification.close();

	const targetUrl =
		event.notification && event.notification.data && event.notification.data.url
			? event.notification.data.url
			: "/chat";

	event.waitUntil(
		self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
			for (const client of clientList) {
				const clientUrl = new URL(client.url);

				if (clientUrl.origin === self.location.origin && "focus" in client) {
					client.focus();

					if ("navigate" in client) {
						return client.navigate(targetUrl);
					}

					return;
				}
			}

			if (self.clients.openWindow) {
				return self.clients.openWindow(targetUrl);
			}
		}),
	);
});
