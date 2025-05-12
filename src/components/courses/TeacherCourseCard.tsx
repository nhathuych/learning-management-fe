import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import Image from 'next/image'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'

const TeacherCourseCard = ({ course, onEdit, onDelete, isOwner }: TeacherCourseCardProps) => {
  return (
    <Card className='group course-card-teacher'>
      <CardHeader className='course-card-teacher__header'>
        <Image
          src={course.image || '/placeholder.png'}
          alt={course.title}
          width={370}
          height={150}
          className='course-card-teacher__image'
          priority
        />
      </CardHeader>

      <CardContent className='course-card-teacher__content'>
        <div className='flex flex-col'>
          <CardTitle className='course-card-teacher__title'>{course.title}</CardTitle>
          <CardDescription className='course-card-teacher__category'>{course.category}</CardDescription>

          <p className='mb-2 text-sm'>
            Status:{' '}
            <span
              className={cn( 'font-semibold px-2 py-1 rounded',
                course.status === 'Published' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              )}
            >
              {course.status}
            </span>
          </p>
          {course.enrollments && (
            <p className='inline-block bg-secondary/10 mt-1 ml-1 font-normal text-secondary text-sm'>
              <span className='font-bold text-white-100'>{course.enrollments.length}</span>{' '}
              Student{course.enrollments.length > 1 ? 's' : ''} Enrolled
            </p>
          )}
        </div>

        <div className='xl:flex gap-2 space-y-2 xl:space-y-0 mt-3 w-full'>
          {isOwner ? (
            <>
              <div>
                <Button onClick={() => onEdit(course)} className='course-card-teacher__edit-button'>
                  <Pencil className='mr-2 size-4' />
                  Edit
                </Button>
              </div>
              <div>
                <Button onClick={() => onDelete(course)} className='course-card-teacher__delete-button'>
                  <Trash2 className='mr-2 size-4' />
                  Delete
                </Button>
              </div>
            </>
          ) : (
            <p className='text-gray-500 text-sm italic'>View Only</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TeacherCourseCard
