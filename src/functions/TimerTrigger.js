const { app, output } = require("@azure/functions");

const eventHubOutput = output.eventHub({
    connection: 'EventHubConnection',
    eventHubName: '%INPUT_EVENTHUB_NAME%'
});

async function TimerTrigger(myTimer, context) {
    context.log('⏰ Timer trigger function started');
    
    // Generate 3-5 test messages
    const messageCount = Math.floor(Math.random() * 3) + 3;
    const messages = [];
    
    for (let i = 0; i < messageCount; i++) {
        const message = {
            id: `msg-${Date.now()}-${i}`,
            message: `Auto-generated test message ${i + 1} at ${new Date().toISOString()}`,
            timestamp: new Date().toISOString()
        };
        messages.push(message);
        context.log(`📝 Generated message: ${message.id}`);
    }
    
    // Send messages to input Event Hub
    context.extraOutputs.set(eventHubOutput, messages);
    context.log(`✅ Sent ${messages.length} message(s) to input Event Hub`);
}

app.timer('TimerTrigger', {
    schedule: '0 */1 * * * *', // Every 1 minute
    handler: TimerTrigger,
    extraOutputs: [eventHubOutput]
});

module.exports = { TimerTrigger };
