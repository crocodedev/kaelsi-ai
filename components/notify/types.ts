export type NotifyType = 'success' | 'error' | 'warning' | 'info';

export interface NotifyProps {
    type: NotifyType
    text: string
}
