
import AddFriendButton from '@/components/AddFriendButton'
import { FC } from 'react'

const page: FC = () => {
  return (
    <main className="max-w-2xl mx-auto mt-16 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-6 text-center">
        Add a Friend
      </h1>
      <p className="text-gray-600 text-center mb-4">
        Start a new conversation by adding your friend's email below.
      </p>
      <div className="flex justify-center">
        <AddFriendButton />
      </div>
    </main>
  )
}

export default page
