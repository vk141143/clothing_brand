import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Mail, Trash2, Edit2, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/support")({
  component: AdminSupport,
});

type Ticket = {
  id: string;
  subject: string;
  customer: string;
  email: string;
  status: "open" | "responded" | "resolved";
  date: string;
  message: string;
  images: string[];
};

const initialTickets: Ticket[] = [
  {
    id: "TKT0231",
    subject: "Wrong product delivered",
    customer: "Priya S.",
    email: "priya@example.com",
    status: "open",
    date: "Today",
    message: "I ordered a red Kanjivaram saree but received a pink one instead. Please help!",
    images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=200&h=200&fit=crop"],
  },
  {
    id: "TKT0230",
    subject: "Return request — bridal saree",
    customer: "Anjali V.",
    email: "anjali@example.com",
    status: "responded",
    date: "Yesterday",
    message: "The saree size doesn't fit properly. I would like to initiate a return.",
    images: [
      "https://images.unsplash.com/photo-1622554894721-088e35d4b8c4?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&h=200&fit=crop",
    ],
  },
  {
    id: "TKT0229",
    subject: "Order delayed",
    customer: "Meera I.",
    email: "meera@example.com",
    status: "resolved",
    date: "2 days ago",
    message: "My order was supposed to arrive yesterday but hasn't come yet. Tracking shows no updates.",
    images: [],
  },
  {
    id: "TKT0228",
    subject: "Quality issue - fading color",
    customer: "Kavita R.",
    email: "kavita@example.com",
    status: "open",
    date: "1 day ago",
    message: "The color faded after first wash. This is poor quality for the price.",
    images: ["https://images.unsplash.com/photo-1610189019983-1f4fd6f17f30?w=200&h=200&fit=crop"],
  },
];

function AdminSupport() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<"open" | "responded" | "resolved">("open");

  const handleStatusUpdate = (id: string, newStatus: "open" | "responded" | "resolved") => {
    setTickets(tickets.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setTickets(tickets.filter((t) => t.id !== id));
  };

  const handleSendMail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "responded":
        return "bg-blue-100 text-blue-800";
      case "open":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Support Dashboard</h1>
        <p className="text-muted-foreground">Manage customer complaints and issues</p>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-24">Ticket ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Images</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <>
                <TableRow key={ticket.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm font-semibold">{ticket.id}</TableCell>
                  <TableCell className="font-medium">{ticket.subject}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{ticket.customer}</div>
                      <div className="text-xs text-muted-foreground">{ticket.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingId === ticket.id ? (
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="open">Open</option>
                        <option value="responded">Responded</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ticket.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {ticket.images.length > 0 ? (
                        ticket.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="complaint"
                            className="w-10 h-10 rounded border object-cover cursor-pointer hover:opacity-80"
                            title="Click to view"
                          />
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">No images</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {editingId === ticket.id ? (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(ticket.id, editStatus)}
                          className="bg-green-600 hover:bg-green-700 h-8"
                        >
                          Save
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingId(ticket.id);
                            setEditStatus(ticket.status);
                          }}
                          className="h-8"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSendMail(ticket.email)}
                        title="Send email to customer"
                        className="h-8"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(ticket.id)}
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
                        className="h-8"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedId === ticket.id && (
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={7} className="py-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Customer Message</h4>
                          <p className="text-sm text-muted-foreground">{ticket.message}</p>
                        </div>
                        {ticket.images.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Images Uploaded</h4>
                            <div className="flex gap-3 flex-wrap">
                              {ticket.images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt="complaint detail"
                                  className="w-32 h-32 rounded border object-cover"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      {tickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No support tickets at the moment</p>
        </div>
      )}
    </div>
  );
}
