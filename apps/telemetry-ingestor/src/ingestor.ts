import type { DroneTelemetry } from "@corridor/domain-core";
import type { PartitionedEventBroker } from "@corridor/event-bus";
import type { SpatialVoxelGrid4D } from "@corridor/spatial-index";

export interface IngestorStats {
  readonly receivedFrames: number;
  readonly rejectedFrames: number;
  readonly flushedBatches: number;
}

/**
 * High-throughput drone telemetry ingestor validating frames, updating the 4D Spatial Index,
 * and publishing normalized position events to the partitioned broker.
 */
export class TelemetryIngestor {
  private readonly broker: PartitionedEventBroker;
  private readonly spatialIndex: SpatialVoxelGrid4D;
  private readonly maxBatchSize: number;
  private buffer: DroneTelemetry[] = [];

  private receivedFrames = 0;
  private rejectedFrames = 0;
  private flushedBatches = 0;

  public constructor(
    broker: PartitionedEventBroker,
    spatialIndex: SpatialVoxelGrid4D,
    maxBatchSize = 250
  ) {
    this.broker = broker;
    this.spatialIndex = spatialIndex;
    this.maxBatchSize = maxBatchSize;
  }

  private validate(frame: DroneTelemetry): boolean {
    if (!frame.droneId || !frame.sectorId) return false;
    if (!Number.isFinite(frame.pos.x) || !Number.isFinite(frame.pos.y) || !Number.isFinite(frame.pos.z)) {
      return false;
    }
    if (!Number.isFinite(frame.batteryPct) || frame.batteryPct < 0 || frame.batteryPct > 100) {
      return false;
    }
    return frame.timestampMs > 0;
  }

  public async ingest(frames: readonly DroneTelemetry[]): Promise<void> {
    for (const frame of frames) {
      if (!this.validate(frame)) {
        this.rejectedFrames++;
        continue;
      }
      this.receivedFrames++;
      this.buffer.push(frame);
      if (this.buffer.length >= this.maxBatchSize) {
        await this.flush();
      }
    }
    if (this.buffer.length > 0) {
      await this.flush();
    }
  }

  public async flush(): Promise<number> {
    if (this.buffer.length === 0) return 0;
    const batch = this.buffer;
    this.buffer = [];

    for (const frame of batch) {
      this.spatialIndex.updateTelemetry(frame);
      await this.broker.publish("telemetry.position", frame.sectorId, frame);
    }

    this.flushedBatches++;
    return batch.length;
  }

  public getStats(): IngestorStats {
    return {
      receivedFrames: this.receivedFrames,
      rejectedFrames: this.rejectedFrames,
      flushedBatches: this.flushedBatches
    };
  }
}
