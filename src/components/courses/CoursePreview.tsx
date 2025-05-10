import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import AccordionSections from '../AccordionSections'

const CoursePreview = ({ course }: CoursePreviewProps) => {
  const price = formatPrice(course.price)

  return (
    <div className='course-preview'>
      <div className='course-preview__container'>
        <div className='course-preview__image-wrapper'>
          <Image
            src={course.image || '/placeholder.png'}
            alt='Course Preview'
            width={640}
            height={360}
            className='w-full'
          />
        </div>
        <div>
          <h2 className='course-preview__title'>{course.title}</h2>
          <p className='mb-4 text-gray-400 text-md'>by {course.teacherName}</p>
          <p className='text-customgreys-dirtyGrey text-sm'>
            {course.description}
          </p>
        </div>

        <div>
          <h4 className='mb-2 font-semibold text-white-50/90'>
            Course Content
          </h4>
          <AccordionSections sections={course.sections} />
        </div>
      </div>

      <div className='course-preview__container'>
        <h3 className='mb-4 text-xl'>Price Details (1 item)</h3>
        <div className='flex justify-between mb-4 text-customgreys-dirtyGrey text-base'>
          <span className='font-bold'>1x {course.title}</span>
          <span className='font-bold'>{price}</span>
        </div>
        <div className='flex justify-between pt-4 border-customgreys-dirtyGrey border-t'>
          <span className='font-bold text-lg'>Total Amount</span>
          <span className='font-bold text-lg'>{price}</span>
        </div>
      </div>
    </div>
  )
}

export default CoursePreview
