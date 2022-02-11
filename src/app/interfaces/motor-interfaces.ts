export enum MotorMode {
  velocity = 0,
  position = 1,
  current = 2,
}

export interface MotorState {
  readonly id: number;
  readonly mode: MotorMode;
  readonly value: number;
}

export interface MotorCmd {
  readonly id: number;
  readonly mode: MotorMode;
  readonly value: number;
}

export enum MotorConnectionMode {
  on = 1,
  off = 0,
  serverErr = -1, // 服务器错误
  noMotor = -2, // 没有该电机
}

export interface MotorConnectionState {
  readonly id: number;
  readonly mode: MotorConnectionMode;
}
