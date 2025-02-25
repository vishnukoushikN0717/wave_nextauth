"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PencilIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  PlusCircleIcon,
  XCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MailIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  userRole: string;
  regionAllocated: string;
  onboarderStatus: boolean;
  lastLogin: string;
  invitationSent?: boolean; // Optional property to track invitation status
}

export function ExternalAccounts() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userLevel, setUserLevel] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isInviting, setIsInviting] = useState<string | null>(null);
  const [invitationSentEmail, setInvitationSentEmail] = useState<string | null>(null); // Temporary state for invitation status

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/WAVExternalUser', {
          method: 'GET',
          headers: {
            'accept': '*/*',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const text = await response.text(); // Get response as text first
        
        try {
          const data = JSON.parse(text); // Try to parse as JSON
          setUsers(data);
        } catch (parseError) {
          console.error('Failed to parse response:', text);
          throw new Error('Invalid response format from server');
        }

      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const normalizeString = (str: string) => 
    str.toLowerCase().replace(/[\s-]+/g, '');

  const filteredUsers = users.filter((user) => {
    const nameMatch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const roleMatch = !userLevel || 
      normalizeString(user.userRole || '') === normalizeString(userLevel);

    return nameMatch && roleMatch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key as keyof User] ?? '';
      const bValue = b[sortConfig.key as keyof User] ?? '';
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const requestSort = (key: keyof User) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof User) => {
    return (
      <span className="inline-flex items-center ml-1">
        <ArrowUpIcon
          className={`h-3 w-3 ${
            sortConfig.key === key && sortConfig.direction === "ascending"
              ? "text-white"
              : "text-gray-400"
          }`}
        />
        <ArrowDownIcon
          className={`h-3 w-3 ${
            sortConfig.key === key && sortConfig.direction === "descending"
              ? "text-white"
              : "text-gray-400"
          }`}
        />
      </span>
    );
  };

  const getAccountOwnerName = (user: User) => {
    if (user.firstName === "string" || !user.firstName || !user.lastName) {
      return user.email;
    }
    if (user.firstName !== "string" && user.lastName !== "string") {
      return `${user.firstName} ${user.lastName}`.trim();
    }
    return user.email;
  };

  const handleSendInvitation = async (email: string) => {
    setIsInviting(email); // Set loading state for the specific user
    try {
      const response = await fetch('/api/WAVExternalUser/send-invitation', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email),
      });

      if (!response.ok) {
        throw new Error('Failed to send invitation');
      }

      // Set the email of the user for whom the invitation was sent
      setInvitationSentEmail(email);

      // Set a timeout to clear the invitation sent message after 3 seconds
      setTimeout(() => {
        setInvitationSentEmail(null);
      }, 2000); // 3000 milliseconds = 3 seconds

      // Refresh user data
      const updatedResponse = await fetch('/api/WAVExternalUser', {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });
      
      if (updatedResponse.ok) {
        const data = await updatedResponse.json();
        setUsers(data);
      }

      toast.success("Invitation Sent", {
        description: `Invitation has been sent to ${email}`,
        duration: 3000,
      });

    } catch (error) {
      toast.error("Failed to Send Invitation", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsInviting(null); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] overflow-x-hidden">
      {/* Fixed Header */}
      <div className="flex-none">
        {/* Fixed Filters and Actions */}
        <div className="flex items-center justify-between gap-4 bg-background p-3 rounded-lg shadow-sm border mb-4">
          <div className="flex items-center gap-4 flex-1">
            <Input
              placeholder="Search by Name or Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px]"
            />
            <Select value={userLevel} onValueChange={setUserLevel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="User Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="External Admin">External Admin</SelectItem>
                <SelectItem value="External User">External User</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || userLevel) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setUserLevel("");
                }}
              >
                <XCircleIcon className="h-4 w-4 mr-2" />
                Clear Filter
              </Button>
            )}
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-500 text-white"
            onClick={() => router.push("/internal/dashboard/createExternal")}
          >
            <PlusCircleIcon className="h-4 w-4 mr-2" />
            Create External Account
          </Button>
        </div>
      </div>

      {/* Scrollable Table Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="pr-4">
          <table className="w-full divide-y divide-border">
            <thead className="bg-gray-200 dark:bg-gray-800 sticky top-0">
              <tr>
                <th scope="col" className="w-[8%] p-2 text-gray-700 dark:text-gray-200 font-semibold text-left">
                  Sr No.
                </th>
                <th scope="col" className="w-[20%] p-2 text-gray-700 dark:text-gray-200 font-semibold cursor-pointer text-left" onClick={() => requestSort("firstName")}>
                  Account Owner {getSortIcon("firstName")}
                </th>
                <th scope="col" className="w-[18%] p-2 text-gray-700 dark:text-gray-200 font-semibold cursor-pointer text-left" onClick={() => requestSort("userRole")}>
                  Account Type {getSortIcon("userRole")}
                </th>
                <th scope="col" className="w-[15%] p-2 text-gray-700 dark:text-gray-200 font-semibold cursor-pointer text-left" onClick={() => requestSort("regionAllocated")}>
                  Region {getSortIcon("regionAllocated")}
                </th>
                <th scope="col" className="w-[15%] p-2 text-gray-700 dark:text-gray-200 font-semibold cursor-pointer text-left" onClick={() => requestSort("onboarderStatus")}>
                  Account Status {getSortIcon("onboarderStatus")}
                </th>
                <th scope="col" className="w-[15%] p-2 text-gray-700 dark:text-gray-200 font-semibold cursor-pointer text-left" onClick={() => requestSort("lastLogin")}>
                  Last Login {getSortIcon("lastLogin")}
                </th>
                <th scope="col" className="w-[9%] p-2 text-gray-700 dark:text-gray-200 font-semibold text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {paginatedUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-accent/50">
                  <td className="w-[8%] p-2 text-sm font-medium whitespace-nowrap">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="w-[20%] p-2 text-sm whitespace-nowrap">
                    {getAccountOwnerName(user)}
                  </td>
                  <td className="w-[18%] p-2 text-sm whitespace-nowrap">
                    {user.userRole}
                  </td>
                  <td className="w-[15%] p-2 text-sm whitespace-nowrap">
                    {user.regionAllocated}
                  </td>
                  <td className="w-[15%] p-2 text-sm whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.onboarderStatus 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.onboarderStatus ? 'Onboarded' : 'Invited'}
                    </span>
                  </td>
                  <td className="w-[15%] p-2 text-sm whitespace-nowrap">
                    {user.lastLogin}
                  </td>
                  <td className="w-[9%] p-2 text-sm whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {invitationSentEmail === user.email && (
                        <span className="text-green-600">✔ Invitation Sent</span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:text-blue-600 hover:bg-blue-100/50 dark:hover:bg-blue-900/50"
                        onClick={() => handleSendInvitation(user.email)}
                        disabled={isInviting === user.email}
                      >
                        {isInviting === user.email ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MailIcon className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:text-blue-600 hover:bg-blue-100/50 dark:hover:bg-blue-900/50"
                        onClick={() => router.push(`/internal/dashboard/edit-external-profile/${encodeURIComponent(user.id)}`)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:text-blue-600 hover:bg-blue-100/50 dark:hover:bg-blue-900/50"
                        onClick={() => router.push(`/internal/dashboard/external-profile/${encodeURIComponent(user.id)}`)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fixed Pagination */}
      <div className="flex-none mt-4">
        <div className="flex items-center justify-between gap-4 bg-background p-3 rounded-lg shadow-sm border">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                className={`${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : ""
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}