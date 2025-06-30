import { createSignal, onMount } from "solid-js";
import { useAuth } from "../store/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  const { user, logout } = useAuth();
  const currentUser = user();
  const [profilePhoto, setProfilePhoto] = createSignal<string | null>(
    localStorage.getItem("profilePhoto") || null
  );
  const [animateIn, setAnimateIn] = createSignal(false);

  const handlePhotoUpload = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setProfilePhoto(base64);
        localStorage.setItem("profilePhoto", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    localStorage.removeItem("profilePhoto");
  };

  onMount(() => {
    setTimeout(() => setAnimateIn(true), 100); // trigger animation after mount
  });

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <div class="container mx-auto p-6 text-center min-h-[60vh] flex items-center justify-center">
          <p class="text-gray-700 dark:text-gray-300">
            Anda belum login. Silakan{" "}
            <a href="/login" class="text-blue-600 underline hover:text-blue-800">
              login
            </a>{" "}
            terlebih dahulu.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
 <div
  class={`container mx-auto px-4 pt-20 min-h-[60vh] transform transition duration-700 ${
    animateIn() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`}
>
        <h1 class="text-3xl font-heading font-bold mb-6 text-center dark:text-white">Profil Saya</h1>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-lg mx-auto transition duration-500">
          <div class="flex flex-col items-center">
            {/* Avatar */}
            {profilePhoto() ? (
              <>
                <img
                  src={profilePhoto()!}
                  alt="Profile"
                  class="w-32 h-32 rounded-full shadow-md object-cover mb-3 transition hover:scale-105"
                />
                <button
                  onClick={handleRemovePhoto}
                  class="text-sm text-red-500 hover:underline mb-4"
                >
                  Hapus Foto
                </button>
              </>
            ) : (
              <>
                <div class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl mb-4">
                  ?
                </div>
              </>
            )}

            <label
              class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition mb-6"
            >
              {profilePhoto() ? "Ganti Foto" : "Tambah Foto"}
              <input
                type="file"
                accept="image/*"
                class="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>

          {/* User info */}
          <div class="space-y-4">
            <div>
              <label class="block font-medium text-gray-700 dark:text-gray-300">Nama</label>
              <p class="text-gray-900 dark:text-white">{currentUser.name}</p>
            </div>
            <div>
              <label class="block font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p class="text-gray-900 dark:text-white">{currentUser.email}</p>
            </div>
          </div>

          <div class="mt-6 text-right">
            <button
              onClick={logout}
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}