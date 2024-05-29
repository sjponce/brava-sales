import { LayoutMaterial } from '@/components/Layout/Layout';
import { useNavigate } from 'react-router-dom';

export default function DashboardModule() {
  const navigate = useNavigate();
  return (
    <>
      <LayoutMaterial />
    </>
  );
}
