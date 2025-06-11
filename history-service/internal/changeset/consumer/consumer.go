package consumer

import (
	"context"
	"encoding/json"
	"github.com/izzahaj/heimscheisser/history-service/internal/changeset"
	"github.com/izzahaj/heimscheisser/history-service/internal/changeset/service"
	"github.com/nats-io/nats.go"
	"log/slog"
	"time"
)

type Consumer struct {
	service service.Service
}

func NewConsumer(service service.Service) *Consumer {
	return &Consumer{service}
}

func (c *Consumer) Subscribe(nc *nats.Conn) error {
	js, err := nc.JetStream()

	if err = c.SubscribeToToiletCreated(js); err != nil {
		return err
	}

	if err = c.SubscribeToToiletUpdated(js); err != nil {
		return err
	}

	return nil
}

func (c *Consumer) handleEvent(msg *nats.Msg, eventID string) {
	var event changeset.ToiletUpdatedEvent

	if err := json.Unmarshal(msg.Data, &event); err != nil {
		slog.Error("error unmarshalling event",
			slog.String("event_id", eventID),
			slog.Any("error", err),
		)
		return
	}

	cs := &changeset.Changeset{
		ToiletID:    event.ToiletID,
		ChangedBy:   event.ChangedBy,
		Description: event.Description,
		NewState:    event.NewState,
	}

	createdCS, err := c.service.CreateChangeset(context.Background(), cs)
	if err != nil {
		slog.Error("error creating changeset from event",
			slog.String("event_id", eventID),
			slog.Any("error", err),
		)
		return
	}

	slog.Info("successfully created changeset from event",
		slog.String("event_id", eventID),
		slog.String("changeset_id", createdCS.ID.String()),
		slog.String("toilet_id", createdCS.ToiletID.String()),
	)

	if err = msg.Ack(); err != nil {
		slog.Error("error acknowledging message",
			slog.String("event_id", eventID),
			slog.Any("error", err),
		)
	}
}

func (c *Consumer) SubscribeToToiletCreated(js nats.JetStreamContext) error {
	_, err := js.Subscribe("toilet.created", func(msg *nats.Msg) {
		eventID := msg.Header.Get("event_id")
		c.handleEvent(msg, eventID)
	}, nats.Durable("toilet-created-consumer"),
		nats.ManualAck(),
		nats.AckWait(30*time.Second),
		nats.MaxDeliver(5),
	)

	return err
}

func (c *Consumer) SubscribeToToiletUpdated(js nats.JetStreamContext) error {
	_, err := js.Subscribe("toilet.updated", func(msg *nats.Msg) {
		eventID := msg.Header.Get("event_id")
		c.handleEvent(msg, eventID)
	}, nats.Durable("toilet-updated-consumer"),
		nats.ManualAck(),
		nats.AckWait(30*time.Second),
		nats.MaxDeliver(5),
	)

	return err
}
