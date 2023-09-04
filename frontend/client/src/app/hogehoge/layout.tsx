import { Header, MainContetns } from '@/components/Layout';

export default function MainLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <div>
      <Header />
      <MainContetns>{children}</MainContetns>
    </div>
  );
}
