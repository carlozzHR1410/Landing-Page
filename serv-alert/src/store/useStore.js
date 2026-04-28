import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getTodayKey, sortAppointments, toMonthKey } from '../utils/date'

const services = [
  { id: 'consulta', name: 'Consulta general', duration: '45 min' },
  { id: 'revision', name: 'Revision tecnica', duration: '30 min' },
  { id: 'mantenimiento', name: 'Mantenimiento preventivo', duration: '60 min' },
]

const branches = [
  { id: 'san-miguel', name: 'San Miguel Centro' },
  { id: 'usulutan', name: 'Usulutan Norte' },
  { id: 'la-union', name: 'La Union Costa' },
]

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']

const statusOptions = ['pendiente', 'completada', 'cancelada']

const defaultUsers = [
  {
    id: 'admin-default',
    name: 'Administrador',
    email: 'admin@servalert.app',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 'client-demo',
    name: 'Cliente Demo',
    email: 'cliente@servalert.app',
    password: 'cliente123',
    role: 'client',
  },
]

const today = getTodayKey()

const defaultAppointments = [
  {
    id: crypto.randomUUID(),
    clientId: 'client-demo',
    clientName: 'Cliente Demo',
    serviceId: 'consulta',
    branchId: 'san-miguel',
    date: today,
    time: '09:00',
    status: 'pendiente',
    notes: 'Consulta inicial para evaluacion del servicio.',
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    clientId: 'client-demo',
    clientName: 'Cliente Demo',
    serviceId: 'revision',
    branchId: 'usulutan',
    date: today,
    time: '14:00',
    status: 'completada',
    notes: 'Revision rapida de control y seguimiento.',
    createdAt: new Date().toISOString(),
  },
]

const findCurrentUser = (state) => state.users.find((user) => user.id === state.currentUserId) || null

const isSlotTaken = (appointments, payload, ignoreId = null) =>
  appointments.some(
    (appointment) =>
      appointment.id !== ignoreId &&
      appointment.date === payload.date &&
      appointment.time === payload.time &&
      appointment.status !== 'cancelada',
  )

const canManageAppointment = (user, appointment) =>
  Boolean(user) && (user.role === 'admin' || appointment.clientId === user.id)

export const useStore = create(
  persist(
    (set, get) => ({
      services,
      branches,
      timeSlots,
      statusOptions,
      users: defaultUsers,
      currentUserId: null,
      appointments: sortAppointments(defaultAppointments),
      selectedDate: today,
      selectedMonth: toMonthKey(today),
      flash: null,
      setSelectedDate: (date) =>
        set({
          selectedDate: date,
          selectedMonth: toMonthKey(date),
        }),
      setSelectedMonth: (monthKey) => set({ selectedMonth: monthKey }),
      clearFlash: () => set({ flash: null }),
      login: async ({ email, password }) => {
        const match = get().users.find(
          (user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password,
        )

        if (!match) {
          return { ok: false, message: 'Credenciales invalidas. Revisa tu correo y contrasena.' }
        }

        set({
          currentUserId: match.id,
          flash: {
            type: 'success',
            message: `Bienvenido de nuevo, ${match.name}.`,
          },
        })

        return { ok: true, message: 'Sesion iniciada correctamente.' }
      },
      register: async ({ name, email, password }) => {
        const cleanEmail = email.trim().toLowerCase()

        if (!name.trim() || !cleanEmail || password.trim().length < 6) {
          return {
            ok: false,
            message: 'Completa nombre, correo y una contrasena de al menos 6 caracteres.',
          }
        }

        if (get().users.some((user) => user.email.toLowerCase() === cleanEmail)) {
          return { ok: false, message: 'Ese correo ya esta registrado en el sistema.' }
        }

        const nextUser = {
          id: crypto.randomUUID(),
          name: name.trim(),
          email: cleanEmail,
          password,
          role: 'client',
        }

        set((state) => ({
          users: [...state.users, nextUser],
          currentUserId: nextUser.id,
          flash: {
            type: 'success',
            message: `Cuenta creada para ${nextUser.name}. Ya puedes reservar tu cita.`,
          },
        }))

        return { ok: true, message: 'Registro completado.' }
      },
      logout: () =>
        set({
          currentUserId: null,
          flash: {
            type: 'info',
            message: 'Sesion cerrada correctamente.',
          },
        }),
      bookAppointment: async (payload) => {
        const currentUser = findCurrentUser(get())

        if (!currentUser) {
          return { ok: false, message: 'Debes iniciar sesion antes de reservar una cita.' }
        }

        if (!payload.serviceId || !payload.branchId || !payload.date || !payload.time) {
          return { ok: false, message: 'Completa servicio, sucursal, fecha y hora.' }
        }

        if (isSlotTaken(get().appointments, payload)) {
          return { ok: false, message: 'Ese horario ya esta ocupado. Elige otro espacio.' }
        }

        const appointment = {
          id: crypto.randomUUID(),
          clientId: currentUser.id,
          clientName: currentUser.name,
          serviceId: payload.serviceId,
          branchId: payload.branchId,
          date: payload.date,
          time: payload.time,
          status: 'pendiente',
          notes: payload.notes?.trim() || 'Sin comentarios adicionales.',
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          appointments: sortAppointments([...state.appointments, appointment]),
          selectedDate: appointment.date,
          selectedMonth: toMonthKey(appointment.date),
          flash: {
            type: 'success',
            message: `Tu cita fue reservada para ${appointment.date} a las ${appointment.time}.`,
          },
        }))

        return { ok: true, message: 'Reserva creada con exito.', appointment }
      },
      updateAppointment: async (appointmentId, payload) => {
        const state = get()
        const currentUser = findCurrentUser(state)
        const currentAppointment = state.appointments.find((appointment) => appointment.id === appointmentId)

        if (!currentAppointment) {
          return { ok: false, message: 'No se encontro la cita que intentas editar.' }
        }

        if (!canManageAppointment(currentUser, currentAppointment)) {
          return { ok: false, message: 'No tienes permisos para editar esta cita.' }
        }

        if (isSlotTaken(state.appointments, payload, appointmentId)) {
          return { ok: false, message: 'Ese horario ya fue reservado por otro cliente.' }
        }

        const nextAppointment = {
          ...currentAppointment,
          ...payload,
          status: payload.status || currentAppointment.status,
          notes: payload.notes?.trim() || currentAppointment.notes,
        }

        set((prevState) => ({
          appointments: sortAppointments(
            prevState.appointments.map((appointment) =>
              appointment.id === appointmentId ? nextAppointment : appointment,
            ),
          ),
          selectedDate: nextAppointment.date,
          selectedMonth: toMonthKey(nextAppointment.date),
          flash: {
            type: 'success',
            message: 'La cita fue actualizada correctamente.',
          },
        }))

        return { ok: true, message: 'Cambios guardados.', appointment: nextAppointment }
      },
      cancelAppointment: async (appointmentId) => {
        const state = get()
        const currentUser = findCurrentUser(state)
        const currentAppointment = state.appointments.find((appointment) => appointment.id === appointmentId)

        if (!currentAppointment) {
          return { ok: false, message: 'No se encontro la cita seleccionada.' }
        }

        if (!canManageAppointment(currentUser, currentAppointment)) {
          return { ok: false, message: 'No puedes cancelar una cita que no te pertenece.' }
        }

        set((prevState) => ({
          appointments: sortAppointments(
            prevState.appointments.map((appointment) =>
              appointment.id === appointmentId
                ? { ...appointment, status: 'cancelada' }
                : appointment,
            ),
          ),
          flash: {
            type: 'info',
            message: 'La cita fue cancelada.',
          },
        }))

        return { ok: true, message: 'Cita cancelada.' }
      },
    }),
    {
      name: 'serv-alert-scheduler',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        currentUserId: state.currentUserId,
        appointments: state.appointments,
        selectedDate: state.selectedDate,
        selectedMonth: state.selectedMonth,
      }),
    },
  ),
)
