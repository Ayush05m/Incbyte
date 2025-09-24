import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

const AdminPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary-600" />
            Admin Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a protected area for administrators only.</p>
          <p className="mt-4">Here you can manage sweets, view user data, and perform other administrative tasks.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;