import { formatPrice } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import Image from 'next/image'

const CourseCard = ({ course, onGoToCourse }: CourseCardProps) => {
  return (
    <Card className='group course-card' onClick={() => onGoToCourse(course)}>
      <CardHeader className='course-card__header'>
        <Image
          src={course.image || '/placeholder.png'}
          alt={course.title}
          width={400}
          height={350}
          className='course-card__image'
          priority
        />
      </CardHeader>
      <CardContent className='course-card__content'>
        <CardTitle className='course-card__title'>
          {course.title}: {course.description}
        </CardTitle>

        <div className='flex items-center gap-2'>
          <Avatar className='size-6'>
            <AvatarImage alt={course.teacherName} />
            <AvatarFallback className='bg-secondary-700 text-black'>
              {course.teacherName[0]}
            </AvatarFallback>
          </Avatar>

          <p className='text-customgreys-dirtyGrey text-sm'>
            {course.teacherName}
          </p>
        </div>

        <CardFooter className='course-card__footer'>
          <div className='course-card__category'>{course.category}</div>
          <span className='course-card__price'>{formatPrice(course.price)}</span>
        </CardFooter>
      </CardContent>
    </Card>
  )
}

export default CourseCard
