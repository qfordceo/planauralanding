# Safe to Share Project Structure

```typescript
// UI Components Structure
src/components/Layout.tsx
```tsx
import { Outlet } from "react-router-dom";
import { Footer } from "./layout/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

// Floor Plan Components (Sanitized)
```typescript
export const FloorPlanScraper = () => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="url">Enter URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <FileUploadTab onUploadComplete={setUploadedImageUrl} />
        </TabsContent>

        <TabsContent value="url">
          <UrlUploadTab onUrlSubmit={setUploadedImageUrl} />
        </TabsContent>
      </Tabs>

      {uploadedImageUrl && (
        <FloorPlanPreview imageUrl={uploadedImageUrl} />
      )}
    </div>
  );
};
```

// Client Dashboard Structure (Sanitized)
```typescript
export function ClientDashboard() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TaskManagement />
        <MilestoneTracker />
      </div>

      <DashboardGrid />
    </div>
  );
}
```

// Shared UI Components
```typescript
// Button example
const Button = ({ children }: { children: React.ReactNode }) => {
  return (
    <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">
      {children}
    </button>
  );
};

// Card example
const Card = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
};
```

# Project Structure Overview

```
src/
├── components/
│   ├── layout/
│   ├── client/
│   ├── contractor/
│   └── ui/
├── pages/
├── hooks/
└── types/
```

# Technologies Used
- React with TypeScript
- Tailwind CSS for styling
- Shadcn UI components
- React Router for navigation
- React Query for data management
- Lucide React for icons

# Component Patterns
- Responsive design using Tailwind classes
- Component composition
- Custom hooks for shared logic
- TypeScript interfaces for type safety
- Modular component structure

This sanitized version excludes:
- API endpoints
- Database schemas
- Authentication logic
- Environment variables
- Business logic
- Private routes
- User data handling