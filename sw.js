self.addEventListener('push', function(event) {
    const data = event.data.json();
    self.registration.showNotification("HEXA: Входящий вызов", {
        body: "Вам звонит " + data.caller,
        icon: "https://cdn-icons-png.flaticon.com/512/5968/5968756.png",
        tag: "call-notification",
        renotify: true,
        requireInteraction: true // Уведомление не исчезнет, пока не нажмешь
    });
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/') // Открывает мессенджер при клике
    );
});
