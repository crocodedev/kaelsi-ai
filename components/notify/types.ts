export type NotifyType = 'success' | 'error' | 'warning' | 'info';

export type NotifyProps = {
    type: NotifyType
    text: string
}
