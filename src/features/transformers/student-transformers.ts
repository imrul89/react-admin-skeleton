import dayjs from 'dayjs';
import { Student, StudentFormData, StudentRequestData } from '@models/student-model';

export const transformedToRequestData = (student: StudentFormData): StudentRequestData => {
  return {
    student: {
      class_id: student.class_id,
      roll: student.roll
    },
    studentDetails: {
      name: student.name,
      gender: student.gender,
      religion_id: student.religion_id,
      dob: dayjs(student.dob).format('YYYY-MM-DD'),
      blood_group: student.blood_group,
      mobile_no: student.mobile_no
    },
    parents: [
      {
        parent: {
          name: student.father_name,
          mobile_no: student.father_mobile_no,
          occupation_id: student.father_occupation_id
        },
        relationship: 'Father'
      },
      {
        parent: {
          name: student.mother_name,
          mobile_no: student.mother_mobile_no,
          occupation_id: student.mother_occupation_id
        },
        relationship: 'Mother'
      }
    ],
    addresses: [
      {
        address: {
          upazila_id: student.present_upazila_id,
          address: student.present_address
        },
        type: 1
      },
      ...(student.permanent_upazila_id
        ? [{
            address: {
              upazila_id: student.permanent_upazila_id,
              address: student.permanent_address
            },
            type: 2
          }]
        : []
      )
    ]
  };
};

export const transformedToFormData = (student: Student): StudentFormData => {
  const father = student.studentDetails?.studentParents?.find(p => p.relationship === 'Father')?.parent;
  const mother = student.studentDetails?.studentParents?.find(p => p.relationship === 'Mother')?.parent;
  
  const presentAddress = student.studentDetails?.studentAddresses?.find(a => a.type === '1')?.address;
  const permanentAddress = student.studentDetails?.studentAddresses?.find(a => a.type === '2')?.address;
  
  return {
    id: student.id,
    student_details_id: student.student_details_id,
    name: student.studentDetails?.name,
    class_id: student.class_id,
    roll: student.roll,
    gender: student.studentDetails?.gender,
    religion_id: student.studentDetails?.religion_id,
    dob: student.studentDetails?.dob ? dayjs(student.studentDetails?.dob, 'YYYY-MM-DD') : null,
    blood_group: student.studentDetails?.blood_group,
    mobile_no: student.studentDetails?.mobile_no,
    photo_url: student.studentDetails?.photo ? __IMAGE_BASE_URL__ + '/uploads/students/' + student.studentDetails.photo : undefined,
    father_name: father?.name,
    father_mobile_no: father?.mobile_no,
    father_occupation_id: father?.occupation_id,
    mother_name: mother?.name,
    mother_mobile_no: mother?.mobile_no,
    mother_occupation_id: mother?.occupation_id,
    present_district_id: presentAddress?.upazila?.district_id,
    present_upazila_id: presentAddress?.upazila_id,
    present_address: presentAddress?.address,
    permanent_district_id: permanentAddress?.upazila?.district_id,
    permanent_upazila_id: permanentAddress?.upazila_id,
    permanent_address: permanentAddress?.address
  };
};