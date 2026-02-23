import { Service, ServiceCategory, User } from "@/types/models";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Xolani",
    email: "staff@africonnect.co.za",
    role: "staff",
  },
  {
    id: "2",
    name: "Owner",
    email: "owner@africonnect.co.za",
    role: "owner",
  },
];

export const serviceCategories: ServiceCategory[] = [
  { id: "1", name: "Printing" },
  { id: "2", name: "Internet" },
  { id: "3", name: "Web Services" },
];

export const services: Service[] = [
  {
    id: "1",
    categoryId: "1",
    name: "Black & White Printing",
    price: 2,
    unit: "page",
    isActive: true,
  },
  {
    id: "2",
    categoryId: "1",
    name: "Color Printing",
    price: 5,
    unit: "page",
    isActive: true,
  },
  {
    id: "3",
    categoryId: "2",
    name: "Internet Usage",
    price: 1,
    unit: "minute",
    isActive: true,
  },
];