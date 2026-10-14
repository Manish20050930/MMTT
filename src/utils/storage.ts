import { Booking, DriverApplication } from '../types';
import { INITIAL_BOOKINGS, INITIAL_DRIVERS } from '../data/mockData';

const STORAGE_KEYS = {
  BOOKINGS: 'mmtt_bookings_v1',
  DRIVERS: 'mmtt_drivers_v1',
  SAVED_PLANS: 'mmtt_saved_plans_v1'
};

export function getStoredBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load bookings from storage', e);
    return INITIAL_BOOKINGS;
  }
}

export function saveBooking(booking: Booking): void {
  const all = getStoredBookings();
  const index = all.findIndex((b) => b.id === booking.id);
  if (index >= 0) {
    all[index] = booking;
  } else {
    all.unshift(booking);
  }
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(all));
}

export function getStoredDrivers(): DriverApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRIVERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(INITIAL_DRIVERS));
      return INITIAL_DRIVERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load drivers from storage', e);
    return INITIAL_DRIVERS;
  }
}

export function saveDriverApplication(app: DriverApplication): void {
  const all = getStoredDrivers();
  const index = all.findIndex((d) => d.id === app.id);
  if (index >= 0) {
    all[index] = app;
  } else {
    all.unshift(app);
  }
  localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(all));
}

export function updateDriverStatus(
  id: string,
  newStatus: DriverApplication['status'],
  notes?: string
): void {
  const all = getStoredDrivers();
  const driver = all.find((d) => d.id === id);
  if (driver) {
    driver.status = newStatus;
    if (notes) driver.adminNotes = notes;
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(all));
  }
}

export function assignDriverToBooking(
  bookingId: string,
  driverId: string
): Booking | null {
  const bookings = getStoredBookings();
  const drivers = getStoredDrivers();
  const targetBooking = bookings.find((b) => b.id === bookingId);
  const targetDriver = drivers.find((d) => d.id === driverId);

  if (!targetBooking || !targetDriver) return null;

  targetBooking.status = 'assigned';
  targetBooking.driver = {
    id: targetDriver.id,
    name: targetDriver.fullName,
    phone: targetDriver.phone,
    rating: targetDriver.assignedRating || 4.8,
    photo: '/src/assets/images/mmtt_driver_recruitment_1791998103361.jpg',
    vehicleReg: targetDriver.vehicleDetails?.regNumber || 'TN 01 MMTT 2026',
    vehicleModel: targetDriver.vehicleDetails?.model || targetBooking.vehicle.models,
    status: 'Assigned'
  };

  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  return targetBooking;
}
