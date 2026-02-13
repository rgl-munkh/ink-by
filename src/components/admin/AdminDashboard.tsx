"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AdminDashboard() {
  const [users, setUsers] = useState<unknown[]>([]);
  const [artists, setArtists] = useState<unknown[]>([]);
  const [requests, setRequests] = useState<unknown[]>([]);
  const [quotes, setQuotes] = useState<unknown[]>([]);
  const [bookings, setBookings] = useState<unknown[]>([]);
  const [artistRequests, setArtistRequests] = useState<unknown[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const fetchAll = useCallback(() => {
    Promise.all([
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/admin/artists").then((r) => r.json()),
      fetch("/api/admin/booking-requests").then((r) => r.json()),
      fetch("/api/admin/quotes").then((r) => r.json()),
      fetch("/api/admin/bookings").then((r) => r.json()),
      fetch("/api/admin/become-artist-requests").then((r) => r.json()),
    ]).then(([u, a, r, q, b, ar]) => {
      setUsers(Array.isArray(u) ? u : []);
      setArtists(Array.isArray(a) ? a : []);
      setRequests(Array.isArray(r) ? r : []);
      setQuotes(Array.isArray(q) ? q : []);
      setBookings(Array.isArray(b) ? b : []);
      setArtistRequests(Array.isArray(ar) ? ar : []);
    });
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const cancelRequest = async (id: number) => {
    setLoading(`req-${id}`);
    try {
      const res = await fetch(`/api/admin/booking-requests/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchAll();
      else alert("Failed to cancel");
    } finally {
      setLoading(null);
    }
  };

  const rejectQuote = async (id: number) => {
    setLoading(`quote-${id}`);
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchAll();
      else alert("Failed to reject");
    } finally {
      setLoading(null);
    }
  };

  const reviewArtistRequest = async (
    id: number,
    action: "approve" | "reject",
  ) => {
    setLoading(`artist-req-${id}`);
    try {
      const res = await fetch(
        `/api/admin/become-artist-requests/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        },
      );
      if (res.ok) fetchAll();
      else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Failed to review");
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <Tabs defaultValue="users">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="artists">Artists</TabsTrigger>
        <TabsTrigger value="artist-requests">Become Artist</TabsTrigger>
        <TabsTrigger value="requests">Requests</TabsTrigger>
        <TabsTrigger value="quotes">Quotes</TabsTrigger>
        <TabsTrigger value="bookings">Bookings</TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(
              users as {
                id: number;
                name: string;
                email: string;
                phone: string;
              }[]
            ).map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value="artists">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Timezone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(artists as { id: number; name: string; timezone: string }[]).map(
              (a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.id}</TableCell>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.timezone ?? "UTC"}</TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value="artist-requests">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Instagram</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(
              artistRequests as {
                id: number;
                userName: string;
                userEmail: string;
                phoneNumber: string | null;
                instagramUsername: string | null;
                status: string;
                createdAt: string;
              }[]
            ).map((ar) => (
              <TableRow key={ar.id}>
                <TableCell>{ar.id}</TableCell>
                <TableCell>
                  <div>
                    <div>{ar.userName}</div>
                    <div className="text-muted-foreground text-xs">
                      {ar.userEmail}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{ar.phoneNumber ?? "-"}</TableCell>
                <TableCell>{ar.instagramUsername ?? "-"}</TableCell>
                <TableCell>
                  <Badge>{ar.status}</Badge>
                </TableCell>
                <TableCell>
                  {ar.createdAt
                    ? new Date(ar.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {ar.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={loading !== null}
                        onClick={() => reviewArtistRequest(ar.id, "approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={loading !== null}
                        onClick={() => reviewArtistRequest(ar.id, "reject")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value="requests">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(
              requests as {
                id: number;
                artistId: number;
                status: string;
                createdAt: string;
              }[]
            ).map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.artistId}</TableCell>
                <TableCell>
                  <Badge>{r.status}</Badge>
                </TableCell>
                <TableCell>
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {(r.status === "pending" || r.status === "quoted") && (
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={loading !== null}
                      onClick={() => cancelRequest(r.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value="quotes">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Request</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(
              quotes as {
                id: number;
                bookingRequestId: number;
                status: string;
                price: string;
              }[]
            ).map((q) => (
              <TableRow key={q.id}>
                <TableCell>{q.id}</TableCell>
                <TableCell>{q.bookingRequestId}</TableCell>
                <TableCell>
                  <Badge>{q.status}</Badge>
                </TableCell>
                <TableCell>${q.price}</TableCell>
                <TableCell>
                  {(q.status === "draft" || q.status === "sent") && (
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={loading !== null}
                      onClick={() => rejectQuote(q.id)}
                    >
                      Reject
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value="bookings">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Request</TableHead>
              <TableHead>Quote</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(
              bookings as {
                id: number;
                bookingRequestId: number;
                quoteId: number;
                status: string;
                paymentStatus: string;
              }[]
            ).map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.id}</TableCell>
                <TableCell>{b.bookingRequestId}</TableCell>
                <TableCell>{b.quoteId}</TableCell>
                <TableCell>
                  <Badge>{b.status}</Badge>
                </TableCell>
                <TableCell>{b.paymentStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}
