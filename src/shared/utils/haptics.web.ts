export const ImpactFeedbackStyle = { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' } as const;
export const NotificationFeedbackType = { Success: 'Success', Warning: 'Warning', Error: 'Error' } as const;
export const impactAsync = async (_style?: any): Promise<void> => {};
export const notificationAsync = async (_type?: any): Promise<void> => {};