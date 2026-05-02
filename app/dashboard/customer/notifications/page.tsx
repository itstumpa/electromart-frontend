import { Metadata } from 'next';
import NotificationsClient from './Notificationsclient ';
export const metadata: Metadata = { title: 'Notifications — ElectroMart' };
export default function NotificationsPage() { return <NotificationsClient />; }