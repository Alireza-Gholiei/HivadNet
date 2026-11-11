self.addEventListener("install", function () {
	self.skipWaiting();
});

self.addEventListener("activate", function (event) {
	event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", function (event) {
	event.notification.close();

	event.waitUntil(
		self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
			for (const client of clientList) {
				if ("focus" in client) {
					return client.focus();
				}
			}

			if (self.clients.openWindow) {
				return self.clients.openWindow("/");
			}
		}),
	);
});
