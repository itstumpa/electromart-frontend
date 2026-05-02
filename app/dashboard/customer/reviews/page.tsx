import { Metadata } from 'next';
import ReviewsClient from './Reviewsclient';

export const metadata: Metadata = { title: 'My Reviews — ElectroMart' };
export default function ReviewsPage() { return <ReviewsClient />; }